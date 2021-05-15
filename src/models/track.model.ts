import { List } from 'lodash';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
    description: 'Track description',
    name: 'Track',
})
export class TrackModel {
    @ApiModelProperty({
        description: 'Id of track',
        required: true,
    })
    public _id: string;

    @ApiModelProperty({
        description: 'Title of track',
        required: true,
    })
    public title: string;

    @ApiModelProperty({
        description: 'YouTube URL of track',
        required: true,
    })
    public url: string;
    
    public _rev: string;
}