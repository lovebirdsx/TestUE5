import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { IPlayFlow } from '../../../../Game/Flow/Action';
import { ConfigFile } from '../../../FlowEditor/ConfigFile';
import { Btn, List, Text } from '../../Component/CommonComponent';
import { flowOp } from '../../Operations/Flow';
import { flowListOp } from '../../Operations/FlowList';
import { openFlowEditor } from '../../Util';
import { createObjectScheme, IAnyProps } from '../Type';

function renderPlayFlow(props: IAnyProps): JSX.Element {
    const playFlow = props.Value as IPlayFlow;
    if (playFlow.FlowListName) {
        const flowList = flowListOp.LoadByName(playFlow.FlowListName);
        const flowNames = flowListOp.GetFlowNames(flowList);
        const flow = flowList.Flows.find((flow) => flow.Id === playFlow.FlowId);
        const stateNames = flowOp.GetStateNames(flow);
        const state = flowOp.GetState(flow, playFlow.StateId);
        return (
            <HorizontalBox>
                {props.PrefixElement}
                <List
                    Items={flowListOp.Names}
                    Selected={playFlow.FlowListName}
                    OnSelectChanged={function (flowListName: string): void {
                        const newPlayFlow = flowListOp.CreateDefaultPlayFlowFor(flowListName);
                        props.OnModify(newPlayFlow, 'normal');
                    }}
                    Tip={`选择剧情文件`}
                />
                <List
                    Items={flowNames}
                    Selected={flow ? flow.Name : ''}
                    OnSelectChanged={function (flowName: string): void {
                        const newFlow = flowList.Flows.find((flow) => flow.Name === flowName);
                        const newState =
                            newFlow && newFlow.States.length > 0 ? newFlow.States[0] : null;
                        const newPlayFlow: IPlayFlow = {
                            FlowListName: playFlow.FlowListName,
                            FlowId: newFlow ? newFlow.Id : 0,
                            StateId: newState ? newState.Id : 0,
                        };
                        props.OnModify(newPlayFlow, 'normal');
                    }}
                    Tip={`选择剧情`}
                />
                <List
                    Items={stateNames}
                    Selected={state ? state.Name : ''}
                    OnSelectChanged={function (stateName: string): void {
                        const newState = flow.States.find((state) => state.Name === stateName);
                        const newPlayFlow: IPlayFlow = {
                            FlowListName: playFlow.FlowListName,
                            FlowId: playFlow.FlowId,
                            StateId: newState ? newState.Id : 0,
                        };
                        props.OnModify(newPlayFlow, 'normal');
                    }}
                    Tip={`选择状态`}
                />
                <Btn
                    Text={'⊙'}
                    OnClick={(): void => {
                        openFlowEditor(playFlow.FlowListName);
                    }}
                    Tip={'打开流程配置'}
                />
            </HorizontalBox>
        );
    }

    return (
        <HorizontalBox>
            {props.PrefixElement}
            <Text Text={`No flow list file at [${ConfigFile.FlowListDir}]`} />
        </HorizontalBox>
    );
}

function createDefaultPlayFlow(container: unknown): IPlayFlow {
    return flowListOp.CreateDefaultPlayFlow();
}

export const playFlowScheme = createObjectScheme<IPlayFlow>(
    {
        FlowListName: null,
        FlowId: null,
        StateId: null,
    },
    {
        Meta: {
            Tip: '播放流程配置文件中的某个流程',
        },
        Render: renderPlayFlow,
        Filters: [],
        CreateDefault: createDefaultPlayFlow,
    },
);
