

import { Section1 } from "./Section1";
 import { Section2 } from "./Section2";
import { Section3 } from "./Section3";
import ServicePackages from "./ServicePackage";

export default function Home() {
  return (
    <>
      {/* Section 1 */}
      <Section1/>
      {/* End Section 1 */}

      {/* Section 2 */}
      <Section3/>
      {/* End Section 2 */}
      {/* Section 2 */}
      <Section2/>
      {/* End Section 2 */}
      {/* Section 2 */}
      <ServicePackages/>
      {/* End Section 2 */}
    </>
  );
}