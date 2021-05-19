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
        example: 'Track title',
    })
    public title: string;

    @ApiModelProperty({
        description: 'YouTube URL of track',
        required: true,
        example: "Tracks's YouTube URL"
    })
    public url: string;

}