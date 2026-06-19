import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Donation } from '../donation';
import { DonationType } from '../donation.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-incomplete',
  imports: [DatePipe],
  templateUrl: './incomplete.html',
  styleUrl: './incomplete.css',
})
export class Incomplete implements OnInit {
  private donationService = inject(Donation)

  leads = signal<DonationType[]>([])

  constructor() {
    effect(() => {
      console.log(this.leads())
    })
  }

  ngOnInit(): void {
    this.donationService.getIncompleteDonations().subscribe({
      next: (resp) => this.leads.set(resp.leads.data)
    })
  }

}
