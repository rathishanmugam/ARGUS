import {
  AfterViewInit,
  Component,
  ChangeDetectorRef,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked
} from '@angular/core';
import {merge, fromEvent, of} from 'rxjs';
import {MatTable} from '@angular/material/table';
import {DialogComponent} from './dialog/dialog.component';
import {DataService} from './data.service';
import {catchError, finalize, startWith, tap, throttleTime, distinctUntilChanged, debounceTime} from 'rxjs/operators';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';

export interface User {
  id?: number;
  first: string;
  last: string;
  email: string;
  phone: string;
  location: string;
  hobby: string;
  added?: Date;
  action?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, AfterViewChecked {
  title = 'client';
  displayedColumns: string[] = ['name', 'email', 'phone', 'location', 'hobby', 'update', 'delete'];
  public total: number;
  public pages: number;
  public count: number;
  dataSource;
  public loading: boolean;
  public disabled: boolean;

  users: User[];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, {static: true}) table: MatTable<any>;
  @ViewChild('input', {static: true}) input: ElementRef;

  constructor(private dataService: DataService,
              public dialog: MatDialog,
              private cdr: ChangeDetectorRef,
              public snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.loading = true;
    this.dataService
      .getUsers(0, 10, 'first', 1, '').pipe(throttleTime(50000), catchError(() => of([])),
      finalize(() => this.loading = false))
      .subscribe((result: any) => {
        this.total = result.count;
        this.users = result.docs;
        console.log('total', this.total);
        // this.loadRecordsPage();

        this.dataSource = new MatTableDataSource(result.docs);
        this.pages = Math.round(this.total / 5);
        console.log('the pages are', this.pages);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  ngAfterViewInit(): void {
    // server-side search or filtering by typing in the search name field
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadRecordsPage();
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith(null),
        tap(() => this.loadRecordsPage())
      )
      .subscribe();

  }

  ngAfterViewChecked(): void{
    this.cdr.detectChanges();
  }

  loadRecordsPage(): void {
    this.loading = true;
    const ord = (this.sort.direction === 'asc') ? '1' : '-1';
    console.log('the page:', this.paginator.pageSize, this.paginator.pageIndex, this.sort.direction);
    this.dataService.getUsers(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active,
      parseInt(ord, 10), this.input.nativeElement.value).pipe(debounceTime(900000), catchError(() => of([])),
      finalize(() => this.loading = false))
      .subscribe((result: any) => {
        console.log('tot record', this.total);
        this.total = result.count;
        this.users = result.docs;
        this.dataSource = new MatTableDataSource(result.docs);
      });
  }

  openDialog(action, obj): void {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '425px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {

      const added = new Date().toLocaleDateString();
      let id = this.total;
      if (id > 0) {
        id++;
      } else {
        id = 1;
      }
      if (result.event === 'Add') {
        console.log('added item', {...result.data, id, added});
        this.dataService.addUser({...result.data, id, added}).subscribe((data: User) => {
          console.log('the added user are', data);
          this.loadRecordsPage();
          this.snackBar.open(`user ${result.data.first} added successfully`, 'ok', {
            duration: 3000
          });
        });

      } else if (result.event === 'Update') {
        console.log('updated item', {...result.data, added});
        this.dataService.updateUser(result.data).subscribe(
          data => {
            this.loadRecordsPage();
            console.log('the new item updated is', data);
            this.snackBar.open(`user ${result.data.first} updated successfully`, 'ok', {
              duration: 3000
            });
          });

      } else if (result.event === 'Delete') {
        this.dataService.deleteUser(result.data).subscribe(
          data => {
            this.loadRecordsPage();
            console.log('the new item deleted is', data);
            this.snackBar.open(`user ${result.data.first} deleted successfully`, 'ok', {
              duration: 3000
            });
          });

      }
    });
  }
}





