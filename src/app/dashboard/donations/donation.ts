import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { apiPath } from '../../app.variables';
import { IncompleteLeadsResp } from './donation.model';

@Service()
export class Donation {
    private httpClient = inject(HttpClient)

    getIncompleteDonations() {
        return this.httpClient.post<IncompleteLeadsResp>(apiPath + 'leads', {
            action: 'getEmailLeads',
            length: 25
        })
    }

}
