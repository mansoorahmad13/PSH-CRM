import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { inject, Service } from '@angular/core';
import { apiPath } from '../../app.variables';
import { IncompleteLeadsResp } from './donation.model';

@Service()
export class Donation {
    private httpClient = inject(HttpClient)

    getIncompleteDonations(
        start: Date | null = null, 
        end: Date | null = null,
        search: string = ''
    ) {
        const apiData = {
            action: 'getEmailLeads',
            length: 25,
            from: start ? formatDate(start, 'yyyy-MM-dd', 'en-US') : null,
            to: end ? formatDate(end, 'yyyy-MM-dd', 'en-US') : null,
            any_thing: search,
            order: JSON.stringify([{ column: 0, dir: 'desc' }]),
            columns: JSON.stringify([
                { data: 'id' },
                { data: 'name' },
                { data: 'email' },
                { data: 'amount' },
            ]),
        }
        return this.httpClient.post<IncompleteLeadsResp>(apiPath + 'leads', apiData)
    }

}
