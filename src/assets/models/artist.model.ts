import { List } from 'lodash';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { TrackModel } from './track.model';

@ApiModel({
    description: 'Artist description',
    name: 'Artist'
})
export class ArtistModel {
    @ApiModelProperty({
        description: 'Name of artist',
        required: true,
        example: 'Rihanna'
    })
    public name: string;

    @ApiModelProperty({
        description: 'Description of artist',
        required: true,
        example: 'Born in Saint Michael and raised in Bridgetown, Barbados'
    })
    public description: string;

    @ApiModelProperty({
        description: 'Genres of artist',
        required: true,
        example: '[\"Pop\",\"R&B\"]'
    })
    public genres: List<string>;

    @ApiModelProperty({
        description: 'Tracks of artist',
        required: true,
        example: "[\"Work\",\"Man Down\"]"
    })
    public tracks: List<TrackModel>;
}
