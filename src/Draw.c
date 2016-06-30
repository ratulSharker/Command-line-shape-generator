#include <stdio.h>
#include <stdlib.h>

char *data;
unsigned int width;
unsigned int height;


int main(int argc, char **argv)
{
	if(argc < 4)
	{
		printf("NOT ENOUGH PARAMETER\n USAGE './a.out 60(width) 40(height) 010001010101...(magic string)'/n");
	}
	else
	{
		//
		//	grab the params
		//
		width = atoi(argv[1]);
		height = atoi(argv[2]);
		data = argv[3];

		//
		//	give a gap between the input & output
		//
		printf("\n\n\n\n\n");

		
		unsigned int x = 0;
		unsigned int y = 0;

		for(y=0;y<height;y++)
		{
			for(x=0;x<width;x++)
			{
				printf("%c",data[x + y * width] == '1' ? '8' : ' ');
			}
			printf("\n");
		}
	}
}