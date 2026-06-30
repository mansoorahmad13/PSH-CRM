import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Donation } from '../donation';
import { DonationType } from '../donation.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { catchError, combineLatest, debounceTime, distinctUntilChanged, EMPTY, filter, startWith, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { dispositions, donationAmounts, pagesOption } from '../donation.variables';
import { ConfirmDialog } from "../../../shared/confirm-dialog/confirm-dialog";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-incomplete',
  imports: [
    DatePipe,
    CurrencyPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatDialogModule 
],
  templateUrl: './incomplete.html',
  styleUrl: './incomplete.css',
})
export class Incomplete implements OnInit {
  private donationService = inject(Donation)
  private destroyRef = inject(DestroyRef)
  private dialog = inject(MatDialog)

  leads = signal<DonationType[]>([])
  loading = signal<boolean>(false)  
  selectedLeads = signal<number[]>([])

  donationAmountOptions = signal(donationAmounts)
  dispositions = signal(dispositions)
  pagesOptions = signal(pagesOption)

  // From / To date range for filtering
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  })
  search = new FormControl('', {
    nonNullable: true
  })
  amount =  new FormControl<number | null>(null)
  disposition = new FormControl<number | null>(null)
  pages = new FormControl<number>(25, {
    nonNullable: true
  })

  ngOnInit(): void {

    combineLatest([
      this.search.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        startWith('')
      ),
      this.range.valueChanges.pipe(
        filter(({start, end}) => (!!start && !!end) || (!start && !end)),
        startWith(this.range.value)
      ),
      this.amount.valueChanges.pipe(
        startWith(null)
      ),
      this.disposition.valueChanges.pipe(
        startWith(null)
      ),
      this.pages.valueChanges.pipe(
        startWith(25)
      )    
    ]).pipe(
      tap(() => this.loading.set(true)),
      switchMap(([search, {start, end}, amount, disposition, pages]) => {
        return this.donationService.getIncompleteDonations(start, end, search, amount, disposition, pages).pipe(
          catchError((err) => {
            console.log(err)
            this.loading.set(false)
            return EMPTY
          }),          
        )
      }),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe({
      next: (resp => {
        this.leads.set(resp.leads.data)
        this.loading.set(false)
      }),
      error: (err => console.log(err))
    })
  }

  clearFilters() {
    this.range.setValue({
      start: null,
      end: null
    })
    this.amount.setValue(null)
    this.disposition.setValue(null)
    this.search.setValue('')
  }

  deleteLead() {
    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: "Delete leads?",
        message: "Are you sure you want to delete the lead(s)?",
        confirmText: "Delete",
        cancelText: "Cancel"
      }
    })

    ref.afterClosed().subscribe(confirmed => {
      if(!confirmed){
        return
      }
      
    })

  }

  updateSelectedLeads(leadId: number) {
    if(this.selectedLeads().includes(leadId)){
      this.selectedLeads.update((prevLeads) => prevLeads.filter((l) => l !== leadId))
    } else {
      this.selectedLeads.update((prevLeads) => [...prevLeads, leadId])
    }
  }

  toggleAllLeads() {
    if(this.selectedLeads().length === this.pages.value) {
      this.selectedLeads.set([])
    } else {
      this.selectedLeads.set(this.leads().map(
        l => l.id
      ))
    }
  }

}
