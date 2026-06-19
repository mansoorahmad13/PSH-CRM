import { afterNextRender, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Donation } from '../donation';
import { DonationType } from '../donation.model';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

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
