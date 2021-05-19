import { List } from 'lodash';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { GenreModel } from './genre.model';

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
        itemType: 'string',
        example: '[\"9408e8d54490f6b8852bc0ef7d00XXXX\",\"9408e8d54490f6b8852bc0ef7d00XXXX\"]'
    })
    public genres: string[];

    public type: string;
}
