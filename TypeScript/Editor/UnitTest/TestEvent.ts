import { log } from '../../Common/Misc/Log';
import { assertEq, assertNe, test } from '../../Common/Misc/Test';
import { Event } from '../../Common/Misc/Util';

export default function testEvent(): void {
    test('event basic', () => {
        const event = new Event<string>('TestEvent');
        let event1Result = '';
        let event2Result = '';
        const eventCallback1 = (name: string): void => {
            log(`Event ${name} received`);
            event1Result = name;
        };
        const eventCallback2 = (name: string): void => {
            log(`Event ${name} received`);
            event2Result = name;
        };
        event.AddCallback(eventCallback1);
        event.AddCallback(eventCallback2);
        event.Invoke('hello');
        assertEq(event1Result, 'hello', 'eventCallback1 must called');
        assertEq(event2Result, 'hello', 'eventCallback2 must called');

        event.RemoveCallBack(eventCallback2);
        event.Invoke('hello2');
        assertEq(event1Result, 'hello2', 'eventCallback1 must called');
        assertNe(event2Result, 'hello2', 'eventCallback1 must not called');
    });
}
