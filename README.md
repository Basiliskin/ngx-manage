 - class descriptor:
 ####Javascript　

```javascript

 @Descriptor([
  new BaseParam(BaseValueType.Undefined,'$base',BaseValueProp.Disabled),
  new BaseParam(BaseValueType.Undefined,'$user',BaseValueProp.Input)
],[ // order 
  'id','name','description','makat','color','test','date','time','sum','parent','value'
])
class CustomValue 
{
  // overwrite class descritor
  @BaseDescriptors([
    new BaseParam(BaseValueType.Text,undefined,BaseValueProp.Disabled,'color'),
    new BaseParam(BaseValueType.Custom,'$user',BaseValueProp.Input,'color')
  ])
  public color:string = 'red';

  @BaseDescriptors([
    new BaseParam(BaseValueType.Custom,undefined,BaseValueProp.Disabled,'autocomplete','makat'),
    new BaseParam(BaseValueType.Custom,'$user',BaseValueProp.Input,'autocomplete','makat')
  ])
  public makat:string = undefined;

  @BaseDescriptors([
      new BaseParam(BaseValueType.Text),
      new BaseParam(BaseValueType.Text,'$user',BaseValueProp.Input)
  ])
  public name:string = '';

  @BaseDescriptors([
    new BaseParam(BaseValueType.Boolean)
  ])
  public test:boolean = false;

  @BaseDescriptors([
    new BaseParam(BaseValueType.Custom,undefined,BaseValueProp.Disabled,'array','id,name'),
    new BaseParam(BaseValueType.Custom,'$user',BaseValueProp.Input,'array','id,name')
  ])
  public value:any = [];

  @BaseDescriptors([
    new BaseParam(BaseValueType.Date)
  ])
  public date:Date = new Date();

  public time:Time = { hours: 0,minutes: 1 };
  public sum:number = 0.0;
  public id:number = 0;

  @BaseDescriptors([
    new BaseParam(BaseValueType.Object),
    new BaseParam(BaseValueType.Object,'$user',BaseValueProp.Disabled)
  ])
  public parent:CustomValue = undefined;

  @BaseDescriptors([
    new BaseParam(BaseValueType.Custom,undefined,BaseValueProp.Disabled,'description'),
    new BaseParam(BaseValueType.Custom,'$user',BaseValueProp.Input,'description')
  ])
  public description:string = '';
}

```