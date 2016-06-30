
var TARGET_CONSOLE_WIDTH;
var TARGET_CONSOLE_HEIGHT;

function mainWindowLoaded()
{
	console.log('main window loaded');

	var buttonUpload = document.getElementById('button_upload');
	buttonUpload.addEventListener('click', uploadbuttonClicked);
}


function uploadbuttonClicked()
{
	var fileInputField = document.getElementById('input_file');
	var selectedFiles = fileInputField.files;

	if(selectedFiles.length > 0)
	{
		console.log('files are available for uploading');
		for(var i=0;i<selectedFiles.length;i++)
		{
			var file = selectedFiles[i];

			if (file.type.match("image.*"))
			{
				console.log('loaded');

				//it's an image file, load
				var fileReader = new FileReader();
				fileReader.addEventListener('load', imageUploadedSuccessfully);
				fileReader.readAsDataURL(file);
				
				break;
			}
			else
			{
				console.log('non-image file was provided');
				alert("non-image file was provided");
				break;
			}
		}
	}
	else
	{
		console.log('no file avialble');
	}
}

function imageUploadedSuccessfully(fileLoadedEvent)
{
	var widthNumberWidget = document.getElementById('input_console_width');
	var heightNumberWidget = document.getElementById('input_console_height');

	TARGET_CONSOLE_WIDTH = widthNumberWidget.value;
	TARGET_CONSOLE_HEIGHT = heightNumberWidget.value;

	var image = new Image();
	image.src = fileLoadedEvent.target.result;
	var canvas = document.getElementById("mainCanvas");
	var ctx = canvas.getContext("2d");

	if(image.width > canvas.width)	image.width = canvas.width;
	if(image.height > canvas.height) image.height = canvas.height;

	//
	//	resizing takes place here
	//
	var imageTopX = (canvas.width - Math.min(canvas.width, image.width))/2;
	var imageTopY = (canvas.height - Math.min(canvas.height, image.height))/2;

	image.width = Math.min(canvas.width, image.width);
	image.height = Math.min(canvas.height, image.height);

	ctx.drawImage(	image,
					imageTopX,
					imageTopY,
					image.width,
					image.height);


	var imgData = ctx.getImageData(imageTopX, imageTopY, image.width, image.height);

	var blockWidth 	= Math.floor(image.width / TARGET_CONSOLE_WIDTH);
	var blockHeight = Math.floor(image.height / TARGET_CONSOLE_HEIGHT);

	//it will be 1/4th the size of the actual image data
	var simplifiedData = new Array();					//will contain image.width * image.height number of pixel information
	var scaledSimplifiedData = new Array();				//will contain TARGET_CONSOLE_WIDTH * TARGET_CONSOLE_HEIGHT number of pixel information

	//console.log(imgData);
	for(var i=0;i<imgData.data.length;i+=4)
	{
		if((imgData.data[i+0] < 200 || imgData.data[i+1] < 200 || imgData.data[i+2] < 200) && imgData.data[i+3] > 50)
		{
			simplifiedData.push(1);
		}
		else
		{
			simplifiedData.push(0);
		}
	}

	console.log("raw data length :: " + imgData.data.length );
	console.log("simplifiedData length :: " + simplifiedData.length);

	var pixelStatus = 0;
	for(var y = 0; y < TARGET_CONSOLE_HEIGHT; y++)
	{
		for(var x = 0; x < TARGET_CONSOLE_WIDTH;x++)
		{
			pixelStatus = 0;

			var blockStartX = x * blockWidth;
			var blockStartY = y * blockHeight;

			for(var q=0;q<blockHeight;q++)
			{
				for(var p=0;p<blockWidth;p++)
				{

					var oneDIndex = (blockStartY + q) * image.width  + (blockStartX + p);

					//can be optimized
					if(simplifiedData[oneDIndex] == undefined)
					{
						//console.log("undefined data found " + oneDIndex);
					}
					pixelStatus = pixelStatus || simplifiedData[oneDIndex];
				}
			}

			scaledSimplifiedData.push(pixelStatus);
		}
	}


	var outputParagraph = document.getElementById('output_para');
	outputParagraph.innerHTML = scaledSimplifiedData.join('');

	console.log(scaledSimplifiedData.length);
	console.log(scaledSimplifiedData);
}



window.addEventListener('load', mainWindowLoaded);
