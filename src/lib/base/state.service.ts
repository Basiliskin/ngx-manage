import {  Subject } from 'rxjs';
import { Type } from '@angular/core';
import 'reflect-metadata'
import { OnDestroy } from '@angular/core';

const Injector = new class {
  hash:any = {};
  // resolving instances
  resolveHash<T>(target: Type<any>): T {
    if(this.hash[target.name])
    {
      return this.hash[target.name];
    }
    // tokens are required dependencies, while injections are resolved tokens from the Injector
    let tokens = Reflect.getMetadata('design:paramtypes', target) || [],
        injections = tokens.map(token => Injector.resolve<any>(token));
    this.hash[target.name] = new target(...injections);
    return this.hash[target.name];
  }
  resolve<T>(target: Type<any>): T {
    // tokens are required dependencies, while injections are resolved tokens from the Injector
    let tokens = Reflect.getMetadata('design:paramtypes', target) || [],
        injections = tokens.map(token => Injector.resolve<any>(token));
    return new target(...injections);
  }
};


export class StateMessage
{
  constructor(
    public name:string,
    public state:any,
    public msg:any
  ){}
}
interface IStateMessageService
{
  SendMessage(name:string,message: any,state:IStateService):Promise<any>;
}

export class StateMessageService implements IStateMessageService
{
  async SendMessage(name:string,message: any,state:IStateService):Promise<any>
  {
    var msg = {};
    state.sendMessage(name,msg);
    return;
  }
}

export interface IStateService
{
  getState(name:string,cb:Function);//:Observable<any>
  sendMessage(name:string,message: any);
  getStates(set);
  read(name:string,id:number):any;
  write(name:string,id:number,data:any,cache:Boolean);
}

class StateService implements IStateService
{
  private version:string  = '1.0.2';
  private subjects = {};
  private state = {};
  constructor()
  {
  }
  private init(name:string):Subject<any>
  {
    if(!this.subjects[name])
    {
      this.state = {};
      this.subjects[name] = new Subject<any>();
    }
    return this.subjects[name];
  }
  getState(name:string,cb:Function){
    return this.init(name).asObservable().subscribe((msg)=>cb(msg));
  }
  getStates(set){
    var subscribtion:any[] = [];
    for(var s in  set)
    {
      subscribtion.push(
        this.init(s).asObservable().subscribe((msg)=>{
          const fn = set[msg.name] || set[s];
          fn(msg)
        })
      );
    }
    return subscribtion;
  }
  sendMessage(name:string,message: any){
    var a = this.init(name);
    a.next({ msg : message,name:name });
  }  
  read(name:string,id:number):any
  {
    const d = this.state[name] || {};
    const i = d[id];
    if(i) return i;

    var data = localStorage.getItem(this.version+'_'+name+'_'+id);
    var cacheData = JSON.parse(data);
    if(cacheData)
    {
      this.state[name] = this.state[name] || {};
      this.state[name][id] = cacheData;
      this.write(name,id,cacheData,true);
      return this.state[name][id];
    }
  }
  write(name:string,id:number,data:any,cache:Boolean = false)
  {
    if(!this.state[name]) this.state[name] = {};
    if(this.state[name])
    {
      this.state[name][id] = data;
    }
    if(!cache)
    {
      var c = JSON.stringify(data);
      localStorage.setItem(this.version+'_'+name+'_'+id, c);
    }
  }
}

export function StateDecorator(config:any) {
  return function _DecoratorName<T extends {new(...args: any[]): {}}>(constr: T){
    var service:IStateMessageService;
    var state : StateService = Injector.resolveHash<StateService>(StateService);
    if(config.service)
    {
      var i = config.service;
      if(i.static)
        service = Injector.resolveHash<typeof i.def>(i.def);
      else
        service = Injector.resolve<typeof i.def>(i.def);
    }
    return class extends constr {
      message:IStateMessageService = service;
      subscribtion:any[] = [];
      getStates(set)
      {
        this.subscribtion = state.getStates(set);
      }
      getState(name:string,cb:Function)
      {
        this.subscribtion.push(state.getState(name,cb));
      }
      sendMessage(name:string,message: any){
        if(this.message)
        {
          this.message.SendMessage(name,message,state);
        }
      }
      ngOnDestroy()
      {
        this.subscribtion.forEach((e)=>e.unsubscribe());
      }
    }
  }
}


export class StateBase implements OnDestroy{
  constructor() { }
  getState(name:string,cb:Function){};
  sendMessage(name:string,message: any){}
  ngOnDestroy(){}
  getStates(set){};
}
