
export interface ClientDtoProps  {
    id?: string;
    name: string;
    email: string;
    phone: string;
    createdAt?: Date;
};

export class Client {
    private props: ClientDtoProps;

    constructor(props: ClientDtoProps){
        this.props = {
            ...props,
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
}

