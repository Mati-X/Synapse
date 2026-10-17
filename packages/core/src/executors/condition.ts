import {NodeCategory, NodeExecutor, NodeExecutorResult} from "../types/execution";
import {resolvePath} from "../engine/interpolator";

export type ConditionOperator = 'equals' | 'not_equals' | 'contains' | 'gt' | 'lt';

export interface ConditionConfig {
    field: string;
    operator: ConditionOperator;
    targetValue: any;
}

export class ConditionExecutor implements NodeExecutor<ConditionConfig> {
    type = 'CORE_CONDITION';
    category: NodeCategory = 'LOGIC';

    async execute(config : ConditionConfig, context: any ): Promise<NodeExecutorResult> {
        let fieldValue: any = resolvePath(context.variables, config.field);
        let isEvaluated : boolean = CompareValues(fieldValue, config.targetValue, config.operator);
        return {
                    output : {
                        evaluated: isEvaluated,
                        result: fieldValue
                    },
                    nextHandle: isEvaluated ? 'true' : 'false'
            }
    }
}

function CompareValues(operand1: any, operand2: any, operator: ConditionOperator): boolean {
    switch (operator)
    {
        case 'equals':
            return operand1 === operand2;
        case 'not_equals':
             return operand1 !== operand2;
        case 'contains':
             return typeof operand1 === 'string' && operand1.includes(String(operand2));
        case 'gt':
             return Number(operand1) > Number(operand2);
        case 'lt':
             return Number(operand1) < Number(operand2);
    }
}