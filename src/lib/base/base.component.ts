import { Component, OnInit } from '@angular/core';
import { AfterViewInit } from '@angular/core';

import { Input } from '@angular/core';
import { TemplateRef } from '@angular/core';

import { TemplateService } from './template.service';
import { BaseValueType, BaseValue, BaseValueProp } from './descriptor';



@Component({
  selector: 'ngx-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit, AfterViewInit {
  @Input('value') _value : any;
  @Input('owner') public owner : any;
  private descriptor:PropertyDescriptor;
  public values:Array<any> = [];
  
  public error:TemplateRef<any>;

  constructor(private template:TemplateService) 
  { 
  }

  ngOnInit() 
  {
    //  <pre>{{Value | json}}</pre>

    this.template.getTemplates().subscribe(
      (message)=>{
          if(message)
          {
            //console.log('subscribe',this);
            const _base_:TemplateRef<any> = message.Template[BaseValueType.Text];
            this.error = message.Template[BaseValueType.Error];
            this.descriptor = this._value!==undefined ? Object.getOwnPropertyDescriptor(this._value.__proto__.__proto__,message.Shema) : undefined;
            var all = [];
            const overwriteProp = this.owner ? this.owner.prop : undefined;

            if(this.descriptor && this.descriptor.value)
            {
              const v = this.descriptor.value;
              
              for(var name of v.list)
              {
                const descriptor:BaseValue = v.hash[name];
                let template;
                if(descriptor.param.type==BaseValueType.Custom && descriptor.param.template)
                {
                  template = message.Template[descriptor.param.template];
                }
                else
                {
                  template = message.Template[descriptor.param.type];
                }
                template = template || _base_;
              

                if(descriptor.param.prop!==BaseValueProp.None)
                {
                  let prop = descriptor.param.prop==BaseValueProp.Input ?
                    (overwriteProp && overwriteProp==BaseValueProp.Disabled ? BaseValueProp.Disabled : descriptor.param.prop)
                    : descriptor.param.prop;
                  
                  all.push({
                    value      : {
                      target  : this._value,
                      prop    : prop,
                      name    : name,
                      owner   : this.owner,
                      param   : descriptor.param,
                      uid     : Math.random().toString(36).substring(2) + Date.now().toString(36),
                      get value() { return this.target[this.name]},
                      set value(value) { 
                          this.target[this.name] = value 
                      } 
                    },
                    template   : template
                  });
                }
              }
            }
            this.values = all;
          }
      }
    );
  }

  ngAfterViewInit() {
  }
}

export class TemplateBaseComponent implements OnInit
{
  @Input('value') Value : any;
  @Input('owner') public Owner : any;
  type:string;
  public disabled:Boolean;

  constructor(){}
  isDisabled(value):Boolean
  {
    return value.prop==BaseValueProp.Disabled;
  }
  isHidden(value):Boolean
  {
    return value.prop==BaseValueProp.Hidden;
  }
  isInput(value):Boolean
  {
    return value.prop==BaseValueProp.Input;
  }
  isText(value):Boolean
  {
    return value.prop==BaseValueProp.Text;
  }
  ngOnInit() 
  {
    this.disabled = this.Value.prop==BaseValueProp.Disabled;
    if(this.Value.prop==BaseValueProp.Input || this.Value.prop==BaseValueProp.Disabled)
    {
      this.type = "text";
    }
    else if(this.Value.prop==BaseValueProp.Hidden)
    {
      this.type = "hidden";
    }
  }

}