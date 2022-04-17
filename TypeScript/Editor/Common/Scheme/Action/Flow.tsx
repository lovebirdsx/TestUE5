import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { createObjectScheme, IAnyProps } from '../../../../Common/Type';
import { gameConfig } from '../../../../Game/Common/Config';
import { flowOp } from '../../../../Game/Common/Operations/Flow';
import { flowListOp } from '../../../../Game/Common/Operations/FlowList';
import { IPlayFlow } from '../../../../Game/Flow/Action';
import { ConfigFile } from '../../../FlowEditor/ConfigFile';
import { Btn, List, Text } from '../../ReactComponent/CommonComponent';
import { sendEditorCommand } from '../../Util';

function openFlowEditor(flowName: string): void {
    const configFile = new ConfigFile();
    configFile.Load();
    configFile.FlowConfigPath = flowListOp.GetPath(flowName);
    configFile.Save();

    sendEditorCommand('RestartFlowEditor');
}

function createDefaultPlayFlowFor(flowListName: string): IPlayFlow {
    const flowList = flowListOp.LoadByName(flowListName);
    const flow = flowList.Flows.length > 0 ? flowList.Flows[0] : null;
    const state = flow && flow.States.length > 0 ? flow.States[0] : null;
    return {
        FlowListName: flowListName,
        FlowId: flow ? flow.Id : 0,
        StateId: state ? state.Id : 0,
    };
}

function createDefaultPlayFlow(): IPlayFlow {
    if (flowListOp.Names.length <= 0) {
        return {
            FlowListName: '',
            FlowId: 0,
            StateId: 0,
        };
    }

    return createDefaultPlayFlowFor(flowListOp.Names[0]);
}

function renderPlayFlow(props: IAnyProps): JSX.Element {
    const playFlow = props.Value as IPlayFlow;
    if (flowListOp.Names.length > 0) {
        if (!flowListOp.Names.includes(playFlow.FlowListName)) {
            return (
                <HorizontalBox>
                    {props.PrefixElement}
                    <List
                        Items={flowListOp.Names}
                        Selected={playFlow.FlowListName}
                        OnSelectChanged={function (flowListName: string): void {
                            const newPlayFlow = createDefaultPlayFlowFor(flowListName);
                            props.OnModify(newPlayFlow, 'normal');
                        }}
                        Tip={`选择剧情文件`}
                    />
                </HorizontalBox>
            );
        }

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
                        const newPlayFlow = createDefaultPlayFlowFor(flowListName);
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
            <Text
                Text={`目录:[${gameConfig.FlowListDir}]\n不存在流程配置文件(前缀为[${gameConfig.FlowListPrefix}])`}
            />
        </HorizontalBox>
    );
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
