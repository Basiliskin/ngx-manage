export const BASE_SHEMA: string = '$base';

export enum BaseValueProp {
  None = 0,
  Text = 1,
  Input = 2,
  Disabled = 3,
  Hidden = 4,
}
export enum BaseValueType {
  Text = 'text', //
  Number = 'number', //
  Array = 'array', //
  Object = 'object', //
  Boolean = 'boolean', //
  Undefined = 'undefined', //
  Date = 'date', //
  Time = 'time', //
  Error = 'error', //
  Custom = 'custom',
}
export class BaseParam {
  constructor(
    public type: BaseValueType = BaseValueType.Text,
    public shema: string = BASE_SHEMA,
    public prop: BaseValueProp = BaseValueProp.Text,
    public template: string = '',
    public provider: string = '',
    public validator: string = '',
  ) {}
}
export class BaseValue {
  constructor(
    public name: string,
    public param: BaseParam, // --
  ) {}
}

function objectType(obj: any): BaseValueType {
  if (obj !== undefined) {
    if (obj instanceof Array) {
      return BaseValueType.Array;
    } else if (typeof obj === 'boolean') {
      return BaseValueType.Boolean;
    } else if (typeof obj === 'number') {
      return BaseValueType.Number;
    } else if (obj && obj.hours !== undefined && '' + obj.hours) {
      return BaseValueType.Time;
    } else if (obj && typeof obj.getMilliseconds === 'function') {
      return BaseValueType.Date;
    } else {
      return BaseValueType.Text;
    }
  }
  return BaseValueType.Undefined;
}

export function Descriptor(descriptor: Array<BaseParam>, property: Array<string>) {
  return function<T extends { new (...args: any[]): {} }>(constructor: T) {
    const a: any = new constructor();
    if (!property) {
      property = Object.getOwnPropertyNames(a);
    }
    const array = property;
    let trg = constructor.prototype;
    //console.log('Descriptor',array,trg);
    function proc(data: BaseParam, propertyKey: string) {
      let base = Object.getOwnPropertyDescriptor(trg, data.shema);
      if (!base) {
        Object.defineProperty(trg, data.shema, {
          configurable: false,
          enumerable: true,
          value: {
            list: [],
            hash: {},
          },
        });
        base = Object.getOwnPropertyDescriptor(trg, data.shema);
      }
      // keep previous definition !
      if (base && !base.value.hash[propertyKey]) {
        base.value.hash[propertyKey] = new BaseValue(propertyKey, data);
        base.value.list.push(propertyKey);
        Object.defineProperty(trg, data.shema, base);
      }
    }

    descriptor.forEach(d => {
      array.forEach(name => {
        let nd: BaseParam = { ...d };
        const t: BaseValueType = nd.type;
        if (t === BaseValueType.Undefined && a) {
          // get value type
          nd.type = objectType(a[name]);
        }
        proc(nd, name);
      });

      let base = Object.getOwnPropertyDescriptor(trg, d.shema);
      if (base) {
        base.value.list = property.slice();
        Object.defineProperty(trg, d.shema, base);
      }
    });
    return class extends constructor {};
  };
}

export function BaseDescriptors(descriptor: Array<BaseParam>) {
  function proc(data: BaseParam, target: any, propertyKey: string) {
    let base = Object.getOwnPropertyDescriptor(target, data.shema);
    if (!base) {
      Object.defineProperty(target, data.shema, {
        configurable: false,
        enumerable: true,
        value: {
          hash: {},
          list: [],
        },
      });
      base = Object.getOwnPropertyDescriptor(target, data.shema);
    }
    if (base) {
      base.value.hash[propertyKey] = new BaseValue(propertyKey, data);
      base.value.list.push(propertyKey);
      Object.defineProperty(target, data.shema, base);
    }
  }
  return function(target: any, propertyKey: string) {
    descriptor.forEach(d => {
      proc(d, target, propertyKey);
    });
  };
}
