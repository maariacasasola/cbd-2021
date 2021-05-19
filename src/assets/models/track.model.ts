import { List } from 'lodash';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
    description: 'Track description',
    name: 'Track',
})
export class TrackModel {

    @ApiModelProperty({
        description: 'Title of track',
        required: true,
        example: 'Men down',
    })
    public title: string;

    @ApiModelProperty({
        description: 'YouTube URL of track',
        required: true,
        example: "https://www.youtube.com/watch?v=CUYrEiym"
    })
    public url: string;

    @ApiModelProperty({
        description: "Track's artist id",
        required: true,
        example: "9408e8d54490f6b8852bc0ef7d00XXXX"
    })
    public artist: string;

    public type: string;
}