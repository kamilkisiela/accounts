import { GraphQLModule } from '@graphql-modules/core';
import { AccountsPassword } from '@accounts/password';
import { AccountsServer } from '@accounts/server';
import TypesTypeDefs from './schema/types';
import getQueryTypeDefs from './schema/query';
import getMutationTypeDefs from './schema/mutation';
import getSchemaDef from './schema/schema-def';
import { Query } from './resolvers/query';
import { Mutation } from './resolvers/mutation';
import { AccountsRequest } from '../accounts';
// tslint:disable-next-line:no-implicit-dependencies
import { mergeGraphQLSchemas } from '@graphql-modules/epoxy';

export interface AccountsPasswordModuleConfig {
  accountsServer: AccountsServer;
  accountsPassword: AccountsPassword;
  rootQueryName?: string;
  rootMutationName?: string;
  extendTypeDefs?: boolean;
  withSchemaDefinition?: boolean;
}

export const AccountsPasswordModule = new GraphQLModule<
  AccountsPasswordModuleConfig,
  AccountsRequest
>({
  name: 'accounts-password',
  typeDefs: ({ config }) =>
    mergeGraphQLSchemas([
      TypesTypeDefs,
      getQueryTypeDefs(config),
      getMutationTypeDefs(config),
      ...(config.withSchemaDefinition ? [getSchemaDef(config)] : []),
    ]),
  resolvers: ({ config }) =>
    ({
      [config.rootQueryName || 'Query']: Query,
      [config.rootMutationName || 'Mutation']: Mutation,
    } as any),
  providers: ({ config }) => [
    {
      provide: AccountsServer,
      useValue: config.accountsServer,
    },
    {
      provide: AccountsPassword,
      useValue: config.accountsPassword,
    },
  ],
});
