import {SagaTreeNode} from './TreeNode';

export class AbortError extends Error {
  public readonly message = 'Aborted';
  public readonly type = 'abort';
  public readonly node?: SagaTreeNode;

  constructor(node?: SagaTreeNode) {
    super();
    this.node = node;
  }
}
