
declare type ResourceArgument = {
  argumentName: string,
  isRequired: boolean,
  forcesNewResource: boolean,
  description: string,
};

declare type ResourceAttribute = {
  attributeName: string,
  description: string,
};

declare type ResourceType = {
  resourceName: string,
  description: string,
  arguments: {
    [argumentName: string]: ResourceArgument
  },
  attributes: {
    [attributeName: string]: ResourceAttribute
  }
};
