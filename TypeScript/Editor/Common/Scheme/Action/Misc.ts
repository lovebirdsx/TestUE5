/* eslint-disable spellcheck/spell-checker */
import {
    createEnumScheme,
    createIntScheme,
    createObjectScheme,
    createStringScheme,
} from '../../../../Common/Type';
import { ILog, IShowMessage, IWait, logLeveConfig } from '../../../../Game/Flow/Action';

export const logScheme = createObjectScheme<ILog>(
    {
        Level: createEnumScheme(logLeveConfig),
        Content: createStringScheme({
            Width: 300,
            Tip: '内容',
            CreateDefault: () => 'Hello World',
        }),
    },
    {
        Tip: '向控制台输出消息',
    },
);

export const showMssageScheme = createObjectScheme<IShowMessage>(
    {
        Content: createStringScheme({
            CreateDefault: () => 'Hello Message',
            Width: 300,
            Tip: '内容',
        }),
    },
    {
        Tip: '在屏幕上显示消息',
    },
);

export const waitScheme = createObjectScheme<IWait>(
    {
        Time: createIntScheme({
            CreateDefault: () => 0.5,
            Tip: '等待时长，单位秒',
        }),
    },
    {
        Tip: '等待一段时间',
    },
);
