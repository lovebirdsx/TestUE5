/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { ILog, IShowMessage, IWait, logLeveConfig } from '../../../../Common/Interface/IAction';
import {
    createEnumScheme,
    createFloatScheme,
    createObjectScheme,
    createStringScheme,
} from '../../Type';

export const logScheme = createObjectScheme<ILog>({
    CnName: '输出',
    Name: 'Log',
    Fields: {
        Level: createEnumScheme({
            Name: 'LogLeveConfig',
            Config: logLeveConfig,
        }),
        Content: createStringScheme({
            Width: 300,
            Tip: '内容',
            CreateDefault: () => 'Hello World',
        }),
    },
    Tip: '向控制台输出消息',
});

export const showMssageScheme = createObjectScheme<IShowMessage>({
    Name: 'ShowMessage',
    CnName: '显示消息',
    Fields: {
        Content: createStringScheme({
            CreateDefault: () => 'Hello Message',
            Width: 300,
            Tip: '内容',
        }),
    },
    Tip: '在屏幕上显示消息',
});

export const waitScheme = createObjectScheme<IWait>({
    CnName: '等待',
    Name: 'Wait',
    Scheduled: true,
    Fields: {
        Min: createFloatScheme({
            CreateDefault: () => 2,
            Optional: true,
            ShowName: true,
            CnName: '最小时间',
            Tip: '等待的最小时间',
            Width: 60,
        }),
        Time: createFloatScheme({
            CreateDefault: () => 5,
            Tip: '等待时长，单位秒, 若配置了最小等待时间, 则为等待的最大时间',
            Width: 60,
        }),
    },
    Check: (value: IWait, messages: string[]): number => {
        if (value.Min !== undefined) {
            if (value.Min <= 0) {
                messages.push(`等待时间必须大于0`);
                return 1;
            }
            if (value.Time < value.Min) {
                messages.push(`等待最小时间不能大于最大时间`);
                return 1;
            }
        } else {
            if (value.Time <= 0) {
                messages.push(`等待时间必须大于0`);
                return 0;
            }
        }
        return 0;
    },
    Tip: '等待一段时间, 若配置了最小等待时间, 则实际的等待时间为两个时间区间内的随机值',
});
