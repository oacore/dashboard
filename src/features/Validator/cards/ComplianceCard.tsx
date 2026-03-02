import "../styles.css"
import table from '../../../assets/icons/rioxTable.svg'
import founds from '../../../assets/icons/rioxFounds.svg'

const complianceCard = () => (
  <article className="content">
    <div className="inner">
      <div className="soon">
        <h5>Coming soon.</h5>
        <p className="riox-info">
          This feature is still under development.
        </p>
      </div>
      <div className="image-wrapper">
        <img className="riox-image" src={table} alt="table" />
        <img className="riox-image" src={founds} alt="founds" />
      </div>
    </div>
  </article>
)

export default complianceCard
