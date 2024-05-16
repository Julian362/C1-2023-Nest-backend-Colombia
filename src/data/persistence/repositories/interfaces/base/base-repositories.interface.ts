export interface BaseRepositoryInterface<E> {
  register(entity: E): Promise<E>;

  update(id: string, entity: E): Promise<E>;

  delete(id: string, soft?: boolean): void;

  findAll(): Promise<E[]>;

  findOneById(id: string): Promise<E>;
}
