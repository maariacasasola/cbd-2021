import { List } from 'lodash';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
    description: 'Artist description',
    name: 'Artist',
})
export class ArtistModel {
    @ApiModelProperty({
        description: 'Id of artist',
        example: ['123456789', '12345'],
        required: true,
    })
    public _id: string;

    @ApiModelProperty({
        description: 'Name of artist',
        required: true,
    })
    public name: string;

    @ApiModelProperty({
        description: 'Description of artist',
        required: true,
    })
    public description: string;

    @ApiModelProperty({
        description: 'Genres of artist',
        required: true,
    })
    public genres: List<string>;

    @ApiModelProperty({
        description: 'Tracks of artist',
        required: true,
    })
    public tracks: List<string>;

    public _rev: string;
}
