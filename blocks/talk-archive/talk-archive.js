/**
 * Talk archive.
 * @param {Element} block
 */
export default function decorate(block) {
  block.innerHTML = `
      <div class="search">
        <input type="search" placeholder="Search">
      </div>
      <div class="filter">
        <div class="filter-category">
          <span class="category">Tags</span>
          <ul>
            <li><label><input type="checkbox" value="AEM">AEM</label></li>
            <li><label><input type="checkbox" value="Analytics">Analytics</label></li>
            <li><label><input type="checkbox" value="Commerce">Commerce</label></li>
            <li><label><input type="checkbox" value="DevOps">DevOps</label></li>
            <li><label><input type="checkbox" value="Frontend">Frontend</label></li>
            <li><label><input type="checkbox" value="OSGi">OSGi</label></li>
            <li><label><input type="checkbox" value="Oak JCR">Oak JCR</label></li>
            <li><label><input type="checkbox" value="Sling">Sling</label></li>
            <li><label><input type="checkbox" value="Testing">Testing</label></li>
            <li><label><input type="checkbox" value="wcm-io">wcm-io</label></li>
          </ul>
        </div>
        <div class="filter-category">
          <span class="category">Year</span>
          <ul class="collapsible collapsed">
            <li><label><input type="checkbox" value="2021">2021</label></li>
            <li><label><input type="checkbox" value="2020">2020</label></li>
            <li><label><input type="checkbox" value="2019">2019</label></li>
            <li><label><input type="checkbox" value="2018">2018</label></li>
            <li><label><input type="checkbox" value="2017">2017</label></li>
            <li><label><input type="checkbox" value="2016">2016</label></li>
            <li><label><input type="checkbox" value="2015">2015</label></li>
            <li><label><input type="checkbox" value="2014">2014</label></li>
            <li><label><input type="checkbox" value="2013">2013</label></li>
            <li><label><input type="checkbox" value="2012">2012</label></li>
            <li><label><input type="checkbox" value="2011">2011</label></li>
            <li class="collapse-toggle more"><a href="#">more...</a></li>
            <li class="collapse-toggle less"><a href="#">less...</a></li>
          </ul>
        </div>
        <div class="filter-category">
          <span class="category">Speaker</span>
          <ul class="collapsible collapsed">
            <li><label><input type="checkbox" value="Adam Pazik">Adam Pazik</label></li>
            <li><label><input type="checkbox" value="Albert Wognar">Albert Wognar</label></li>
            <li><label><input type="checkbox" value="Alexander Berndt">Alexander Berndt</label></li>
            <li><label><input type="checkbox" value="Alexander Klimetschek">Alexander Klimetschek</label></li>
            <li><label><input type="checkbox" value="Alexander Muthmann">Alexander Muthmann</label></li>
            <li><label><input type="checkbox" value="Alexander Saar">Alexander Saar</label></li>
            <li><label><input type="checkbox" value="Alexander Schmidt">Alexander Schmidt</label></li>
            <li><label><input type="checkbox" value="Andon Sikavica">Andon Sikavica</label></li>
            <li><label><input type="checkbox" value="Andreas Czakaj">Andreas Czakaj</label></li>
            <li><label><input type="checkbox" value="Andreas Haller">Andreas Haller</label></li>
            <li><label><input type="checkbox" value="Andreea Miruna Moise">Andreea Miruna Moise</label></li>
            <li><label><input type="checkbox" value="Andrei Darashenka">Andrei Darashenka</label></li>
            <li><label><input type="checkbox" value="Andrei Dulvac">Andrei Dulvac</label></li>
            <li><label><input type="checkbox" value="Andrei Shilov">Andrei Shilov</label></li>
            <li><label><input type="checkbox" value="Andrei Stefan Tuicu">Andrei Stefan Tuicu</label></li>
            <li><label><input type="checkbox" value="Andres Pegam">Andres Pegam</label></li>
            <li><label><input type="checkbox" value="Andrew Savory">Andrew Savory</label></li>
            <li><label><input type="checkbox" value="Angela Schreiber">Angela Schreiber</label></li>
            <li><label><input type="checkbox" value="Ankit Gubrani">Ankit Gubrani</label></li>
            <li><label><input type="checkbox" value="António Ribeiro">António Ribeiro</label></li>
            <li><label><input type="checkbox" value="Artur Rutkiewicz">Artur Rutkiewicz</label></li>
            <li><label><input type="checkbox" value="Bartłomiej Soin">Bartłomiej Soin</label></li>
            <li><label><input type="checkbox" value="Bastian Frank">Bastian Frank</label></li>
            <li><label><input type="checkbox" value="Benedikt Wedenik">Benedikt Wedenik</label></li>
            <li><label><input type="checkbox" value="Bert-Ulrich Baumann">Bert-Ulrich Baumann</label></li>
            <li class="collapse-toggle more"><a href="#">more...</a></li>
            <li class="collapse-toggle less"><a href="#">less...</a></li>
          </ul>
        </div>
      </div>
      <div class="result">
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Talk</th>
              <th>Speaker</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2021</td>
              <td><a href="https://adapt.to/2021/en/schedule/aem-cloud-service-from-a-developer-perspective.html">AEM Cloud Service from a Developer Perspective</a></td>
              <td>Carsten Ziegeler</td>
            </tr>
            <tr>
              <td>2021</td>
              <td><a href="https://adapt.to/2021/en/schedule/aem-commerce-extensibility-using-adobe-io.html">AEM Commerce extensibility using Adobe I/O</a></td>
              <td>Carlos Duque, Markus Haack</td>
            </tr>
            <tr>
              <td>2021</td>
              <td><a href="https://adapt.to/2021/en/schedule/aemaacs-cloud-manager-build-deciphered.html">AEMaaCS Cloud Manager Build Deciphered</a></td>
              <td>Konrad Windszus</td>
            </tr>
            <tr>
              <td>2021</td>
              <td><a href="https://adapt.to/2021/en/schedule/apply-scoring-within-the-adobe-experience-platform.html">Apply Scoring within the Adobe Experience Platform</a></td>
              <td>Artur Rutkiewicz</td>
            </tr>
            <tr>
              <td>2021</td>
              <td><a href="https://adapt.to/2021/en/schedule/collect-data-for-the-adobe-experience-platform-with-the-adobe-mobile-sdk.html">Collect Data for the Adobe Experience Platform with the Adobe Mobile SDK</a></td>
              <td>Lukas Greiter</td>
            </tr>
            <tr>
              <td>2021</td>
              <td><a href="https://adapt.to/2021/en/schedule/content-based-recommendation-engine-in-aem.html">Content Based Recommendation Engine in AEM</a></td>
              <td>Ankit Gubrani</td>
            </tr>
            <tr>
              <td>2021</td>
              <td><a href="https://adapt.to/2021/en/schedule/designing-a-cluster-aware-application.html">Designing a cluster-aware application</a></td>
              <td>Jörg Hoh</td>
            </tr>
            <tr>
              <td>2021</td>
              <td><a href="https://adapt.to/2021/en/schedule/dynamic-media-support-in-wcm-io-media-handler.html">Dynamic Media Support in wcm.io Media Handler</a></td>
              <td>Stefan Seifert</td>
            </tr>
            <tr>
              <td>2021</td>
              <td><a href="https://adapt.to/2021/en/schedule/evolving-api-for-aem-as-a-cloudservice.html">Evolving API for AEM as a Cloudservice – when push-release meets backward compatibility</a></td>
              <td>Dominik Süß</td>
            </tr>
          </tbody>
        </table>
      </div>`;

  // toggle for collapsible filter lists
  block.querySelectorAll('.filter ul.collapsible').forEach((ul) => {
    ul.querySelectorAll(' li.collapse-toggle a').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        ul.classList.toggle('collapsed');
      });
    });
  });
}
