import {SagaInput, SagaIterator, AnyRecord} from './types';

export class SagaTreeNode<
  T = any,
  P extends any[] = any,
  S extends AnyRecord = any,
> {
  public iter?: SagaIterator<T>;
  public readonly saga?: SagaInput<T, P, S>;
  public readonly parent?: SagaTreeNode;
  public readonly children = new Set<SagaTreeNode>();
  public readonly level: number = 0;

  constructor(saga?: SagaInput<T, P, S>, parent?: SagaTreeNode) {
    this.saga = saga;
    this.parent = parent;
    this.level = parent ? parent.level + 1 : 0;
  }

  addChild(child: SagaTreeNode) {
    this.children.add(child);
  }

  removeChild(child: SagaTreeNode) {
    this.children.delete(child);
  }

  cancelAll() {
    this.iter?.cancel();
    for (const child of this.children) {
      child.cancelAll();
    }
  }
}
