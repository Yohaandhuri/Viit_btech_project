package com.eclassroom.management_service.graphql

import graphql.GraphQLError
import graphql.GraphqlErrorException
import graphql.schema.DataFetchingEnvironment
import org.springframework.graphql.execution.DataFetcherExceptionResolverAdapter
import org.springframework.stereotype.Component

@Component
class GraphQLExceptionHandler : DataFetcherExceptionResolverAdapter() {
    override fun resolveToSingleError(ex: Throwable, env: DataFetchingEnvironment): GraphQLError? {
        return when (ex) {
            is GraphqlErrorException -> ex
            else -> null
        }
    }
}