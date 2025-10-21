export interface PolicyConstraint {
  leftOperand: string;
  operator: string;
  rightOperand: string | number | Date;
}

export interface PolicyPermission {
  action: string;
  constraints?: PolicyConstraint[];
}

export interface PolicyProhibition {
  action: string;
  constraints?: PolicyConstraint[];
}

export interface PolicyObligation {
  action: string;
  constraints?: PolicyConstraint[];
}

export interface PolicyRule {
  permissions?: PolicyPermission[];
  prohibitions?: PolicyProhibition[];
  obligations?: PolicyObligation[];
  target?: string;
}

export interface Policy {
  id: string;

  // Basic properties
  name: string;
  description?: string;
  createdAt?: string;

  // Policy content
  type: string;
  policyType?: string;
  rules: PolicyRule;

  // Internal properties (not exposed to users)
  privateProperties?: {
    [key: string]: any;
  };
}

// Form data interface for create/edit operations
export interface PolicyFormData extends Partial<Policy> {
  // Allow additional fields during form editing
  [key: string]: any;
}

// Specific permission types for form handling
export interface TimeBasedPermissionData {
  constraint: {
    leftOperand: { id: string };
  };
  operator: string;
  rightOperand: string | Date;
}

export interface IdentityBasedPermissionData {
  constraint: {
    leftOperand: { id: string };
  };
  operator: string;
  rightOperand: string;
}

export interface LocationBasedPermissionData {
  constraint: {
    leftOperand: { id: string };
  };
  operator: string;
  rightOperand: string;
}
