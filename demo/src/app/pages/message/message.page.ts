import {Component} from '@angular/core';
import {ApiDefinition} from "../../components/api/api.component";

const exampleStandardTemplate = `
<sui-message class="success">
    <div class="header">
        This is a message!
    </div>
    <p>This message can be styled (as shown) and dismissed with the close icon in the top right.</p>
</sui-message>
`;

const exampleNoDismissTemplate = `
<sui-message class="attached warning" [isDismissable]="false">
    <div class="header">
        Attached message!
    </div>
    <p>This message isn't dismissible.</p>
</sui-message>
<div class="ui bottom attached segment">
    <p>Example content</p>
</div>
`;

@Component({
    selector: 'demo-page-message',
    templateUrl: './message.page.html'
})
export class MessagePage {
    public api:ApiDefinition = [
        {
            selector: "<sui-message>",
            properties: [
                {
                    name: "isDismissable",
                    description: "Sets whether or not the message has a dismiss button.",
                    defaultValue: "true"
                },
                {
                    name: "transition",
                    description: "Sets the transition used when dismissing the message.",
                    defaultValue: "slide down"
                },
                {
                    name: "transitionDuration",
                    description: "Sets the duration for the message transition.",
                    defaultValue: "300"
                }
            ],
            events: [
                {
                    name: "dismiss",
                    description: "Fires when the message is dismissed by the user."
                }
            ]
        }
    ];
    public exampleStandardTemplate = exampleStandardTemplate;
    public exampleNoDismissTemplate = exampleNoDismissTemplate;

    public manualDismissMarkup = `
<sui-message #message>
    <div class="header">
        Dismiss Manually
    </div>
</sui-message>

<button (click)="message.dismiss()">Dismiss</button>
<button (click)="dismiss(message)">Dismiss (advanced)</button>
`;

    public manualDismissCode = `
import {IMessage} from "ng2-semantic-ui";
import {ApiDefinition} from '../../components/api/api.component';

@Component({})
export class MyComponent {
    public dismiss(message:IMessage) {
        message.dismiss();
    }
}
`;
}

@Component({
    selector: 'message-example-standard',
    template: exampleStandardTemplate
})
export class MessageExampleStandard {}

@Component({
    selector: 'message-example-no-dismiss',
    template: exampleNoDismissTemplate
})
export class MessageExampleNoDismiss {}

export const MessagePageComponents = [MessagePage, MessageExampleStandard, MessageExampleNoDismiss];
