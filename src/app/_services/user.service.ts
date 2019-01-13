import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User ,BaseDemoConfig} from '@app/_models';

@Injectable({ providedIn: 'root' })
export class UserService {

    config:BaseDemoConfig;

    constructor(private http: HttpClient) { 
        this.config = new BaseDemoConfig();
    }

    
    /*getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: number) {
        return this.http.get(`${environment.apiUrl}/users/${id}`);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    update(user: User) {
        return this.http.put(`${environment.apiUrl}/users/${user.id}`, user);
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }*/

    updateConfiguration(config: BaseDemoConfig){
            this.config = config;
    }

    getConfig():BaseDemoConfig{
        return this.config;
    }
}