import { Composition, Folder } from "remotion";
import { DeliReel } from "./DeliReel";
import { FavoritesScene } from "./scenes/FavoritesScene";
import { HungryScene } from "./scenes/HungryScene";
import { LogoScene } from "./scenes/LogoScene";
import { OrganicScene } from "./scenes/OrganicScene";
import { PackScene } from "./scenes/PackScene";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="DeliReel"
      component={DeliReel}
      durationInFrames={600}
      fps={30}
      width={1080}
      height={1920}
    />
    <Folder name="Scenes">
      <Composition
        id="HungryScene"
        component={HungryScene}
        durationInFrames={105}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ line1: "Hungry?", line2: "In a hurry?" }}
      />
      <Composition
        id="FavoritesScene"
        component={FavoritesScene}
        durationInFrames={135}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          line1: "Mediterranean",
          line2: "Favorites!",
          more: "and more",
        }}
      />
      <Composition
        id="OrganicScene"
        component={OrganicScene}
        durationInFrames={135}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          line1: "Organic Ingredients.",
          line2: "Olive Oil Goodness.",
        }}
      />
      <Composition
        id="PackScene"
        component={PackScene}
        durationInFrames={165}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ word1: "Pick it.", word2: "Pack it.", word3: "Go!" }}
      />
      <Composition
        id="LogoScene"
        component={LogoScene}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ deli: "DELI", tagline: "Fresh. Healthy. On the Go." }}
      />
    </Folder>
  </>
);
