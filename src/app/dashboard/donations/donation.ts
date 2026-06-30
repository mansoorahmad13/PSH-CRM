import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { inject, Service } from '@angular/core';
import { apiPath } from '../../app.variables';
import { DeleteLeadResp, IncompleteLeadsResp, UpdateDispositionResp } from './donation.model';

@Service()
export class Donation {
    private httpClient = inject(HttpClient)

    getIncompleteDonations(
        start: Date | null = null, 
        end: Date | null = null,
        search: string = '',
        amount: number | null = null,
        disposition: number | null = null,
        pages: number = 25
    ) {
        const apiData = {
            action: 'getEmailLeads',
            length: pages,
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
            amount,
            disposition_id: disposition
        }
        return this.httpClient.post<IncompleteLeadsResp>(apiPath + 'leads', apiData)
    }

    deleteLeads(leadIds: number[]) {
        return this.httpClient.post<DeleteLeadResp>(`${apiPath}delete_lead`, {
            ids: leadIds.toString()
        })
    }

    changeDisposition(
        lead_id: number, 
        comment: string, 
        disposition: string | undefined, 
        disposition_id: number, 
        follow_up_time: Date | null
    ) {
        return this.httpClient.post<UpdateDispositionResp>(`${apiPath}leads/comment`, {
                lead_id,
                comment,
                disposition: disposition || '',
                disposition_id,
                follow_up_time: follow_up_time
                    ? formatDate(follow_up_time, 'yyyy-MM-dd HH:mm:ss', 'en-US')
                    : null
            })
    }

}
