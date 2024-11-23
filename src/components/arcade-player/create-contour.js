import { paperCore } from '@blockcode/blocks-player';
import imageContour from '../../lib/image-contour';

export default function (raster) {
  if (raster.size.width <= 0 || raster.size.height <= 0) return;

  const imageData = raster.getImageData(new paperCore.Rectangle(0, 0, raster.size.width, raster.size.height));
  const { width, height } = imageData;
  const segmentsList = imageContour(imageData);

  paperCore.project.layers.contour.addChild(
    new paperCore.Group(
      Object.assign(
        {
          name: `${raster.name}`,
          children: segmentsList.map(
            (segments) => new paperCore.Path(segments.map(([x, y]) => new paperCore.Point(x, y))),
          ),
          pivot: new paperCore.Point(raster.pivot.x + width / 2, raster.pivot.y + height / 2),
          position: raster.position,
          scaling: raster.scaling,
          rotation: raster.rotation,
          applyMatrix: false,
        },
        // for development
        DEVELOPMENT
          ? {
              visible: true,
              strokeColor: '#ff8c1a40',
            }
          : {},
      ),
    ),
  );
}
