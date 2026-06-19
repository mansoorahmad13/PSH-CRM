import { Routes } from "@angular/router";
import { Incomplete } from "./incomplete/incomplete";

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'incomplete',
                pathMatch: 'full'
            },
            {
                path: 'incomplete',
                component: Incomplete
            }
        ],
    }
]