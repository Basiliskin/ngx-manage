import { Injectable } from '@angular/core';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { TemplateRef } from '@angular/core';
import { BASE_SHEMA } from './descriptor';

export type BaseDictionary = { [id: number] : TemplateRef<any>; };

export class TemplateServiceMessage
{
  constructor(public Template: BaseDictionary,public Shema:string = BASE_SHEMA){}
}
@Injectable({
  providedIn: 'root'
})
export class TemplateService 
{
  private subject = new BehaviorSubject<TemplateServiceMessage>(undefined);

  constructor() 
  { 
  }
  load(Template: BaseDictionary,Shema:string = BASE_SHEMA) 
  {
    this.subject.next(new TemplateServiceMessage(Template,Shema));
  }
  getTemplates(): Observable<TemplateServiceMessage> 
  {
    return this.subject.asObservable();
  }
}
