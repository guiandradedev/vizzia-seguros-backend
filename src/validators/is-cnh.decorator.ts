import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsCnhConstraint implements ValidatorConstraintInterface {
  validate(cnh: string, _args: ValidationArguments) {
    if (!cnh || typeof cnh !== 'string') return false;

    // Remove caracteres não numéricos
    cnh = cnh.replace(/[^\d]+/g, '');

    // Deve ter 11 dígitos e não ser uma sequência repetida (ex: 11111111111)
    if (cnh.length !== 11 || /^(\d)\1+$/.test(cnh)) return false;

    let sum = 0;
    let dsc = 0;

    // Primeiro cálculo
    for (let i = 0, j = 9; i < 9; i++, j--) {
      sum += parseInt(cnh.charAt(i)) * j;
    }

    let dv1 = sum % 11;
    if (dv1 >= 10) {
      dv1 = 0;
      dsc = 2;
    }

    sum = 0;

    // Segundo cálculo
    for (let i = 0, j = 1; i < 9; i++, j++) {
      sum += parseInt(cnh.charAt(i)) * j;
    }

    let dv2 = (sum % 11) - dsc;
    if (dv2 < 0) dv2 += 11;
    if (dv2 >= 10) dv2 = 0;

    // Verifica os dígitos verificadores
    return cnh.slice(-2) === `${dv1}${dv2}`;
  }

  defaultMessage(_args: ValidationArguments) {
    return 'CNH inválida';
  }
}

export function IsCnh(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCnhConstraint,
    });
  };
}
