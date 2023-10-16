import ImageOverlay from './ImageOverlay';
import Buttons from './Buttons';

function Grid({ images }) {
  return (
    <div className="grid grid-cols-4 gap-5">
      {images.map((imagen, index) => (
        <div key={index}>
          <ImageOverlay
            imagen={imagen}
            index={index}
          />
          <Buttons
            imagen={imagen}
          />
        </div>
      ))}
    </div>
  );
};

export default Grid;