import React from 'react';
import SimpleImageSlider from 'react-simple-image-slider';
import { sortByNumber } from '../../utils/arrayUtils';

export function ImageSlideshow(props) {
    // Get props and define constants
    const { path, width, height, bullets, margin, showNavs, urls } = props;
    const style = { 
        margin: margin ? margin : '0 auto', 
        whiteSpace: 'nowrap', 
        overflow: 'auto',
        position: 'relative',
    };

    // Create a context for all images in the HomeSlider folder
    let imageContext;
    let imagePaths = [{}];
    const slideImages = [];
    if (path === 'Home') {
        imageContext = require.context('../../assets/HomeSlider', false, /\.(jpg|jpeg)$/);
        // Get a list of all image file paths
        imagePaths = imageContext.keys().map(image => imageContext(image));
        imagePaths = sortByNumber(imagePaths)
        // Image List
        imagePaths.map((path) => {
            slideImages.push({ url: path.replace('.//', './') });
            return slideImages;
        });
    } else if (path === 'About') {
        imageContext = require.context('../../assets/AboutSlider', false, /\.(jpg|jpeg)$/);
        // Get a list of all image file paths
        imagePaths = imageContext.keys().map(image => imageContext(image));
        // Image List
        imagePaths.map((path) => {
            slideImages.push({ url: path.replace('.//', './') });
            return slideImages;
        });
    } else if (path === 'Desktop' || 'Desktop-orig' || path === 'Laptop') {
        imagePaths = urls;
    }

    return (
        <>
            <SimpleImageSlider
                style={style}
                width={width}
                height={height}
                slideDuration={.5}
                autoPlayDelay={4}
                autoPlay={true}
                images={imagePaths}
                navMargin={0}
                showBullets={bullets}
                showNavs={showNavs}
            />
        </>
    );
};
