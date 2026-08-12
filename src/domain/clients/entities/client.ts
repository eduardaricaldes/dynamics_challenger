import { randomUUID } from "crypto";

export interface ClientDtoProps  {
    id?: string;
    name: string;
    email: string;
    phone: string;
    createdAt?: Date;
};

type ClientData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
};




export class Client {
    private props: ClientData;

    constructor(props: ClientDtoProps){
        this.props = {
            ...props,
            id:props.id ?? randomUUID(),
            createdAt: props.createdAt  ?? new Date (),
        };
    }

    get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get phone() {
    return this.props.phone;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  changeName(name: string) {
  this.props.name = name;
  }

  changeEmail(email: string) {
  this.props.email = email;
  }

  changePhone(phone: string) {
  this.props.phone = phone;
  }
}

