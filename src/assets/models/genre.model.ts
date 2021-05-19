import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
    description: 'Genre description',
    name: 'Genre'
})
export class GenreModel {
    @ApiModelProperty({
        description: 'Name of genre',
        required: true,
        example: 'Pop'
    })
    public name: string;

    @ApiModelProperty({
        description: 'Description of genre',
        required: true,
        example: 'Originated in its modern form during the mid-1950s in the United States and the United Kingdom'
    })
    public description: string;

    public type: string;
}
