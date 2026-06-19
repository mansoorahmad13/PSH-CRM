import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Donation } from '../donation';
import { DonationType } from '../donation.model';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { catchError, EMPTY, filter, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-incomplete',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: './incomplete.html',
  styleUrl: './incomplete.css',
})
export class Incomplete implements OnInit {
  private donationService = inject(Donation)
  private destroyRef = inject(DestroyRef)

  leads = signal<DonationType[]>([])
  loading = signal<boolean>(false)

  // From / To date range for filtering
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  })

  ngOnInit(): void {
    this.loadLeads();

    this.range.valueChanges
    .pipe(
      filter(({start, end}) => !!start && !!end),
      tap(() => this.loading.set(true)),
      switchMap(({start, end}) => {
        return this.donationService.getIncompleteDonations(start, end)
      }),
      catchError(err => {
        this.loading.set(false);
        console.log(err);
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe({
      next: (resp) => {
        this.leads.set(resp.leads.data) 
        this.loading.set(false)
      },
      error: (error) => { 
        this.loading.set(false)
        console.log(error)
      }
    })

  }

  loadLeads() {
    this.loading.set(true)
    const subscription = this.donationService.getIncompleteDonations().subscribe({    
      next: (resp) => {
        this.leads.set(resp.leads.data) 
        this.loading.set(false)
      }
    })
    
    this.destroyRef.onDestroy(() => subscription.unsubscribe())
  }

}
