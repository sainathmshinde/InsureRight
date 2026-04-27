import { useNavigate } from "react-router-dom";
import { useBrokerForm } from "./useBrokerForm";
import BrokerForm from "./BrokerForm";
import { BrokerIcon } from "../../icons";

export default function BrokerCreate() {
  const navigate = useNavigate();
  const { form, set, setFile } = useBrokerForm();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST to API
    console.log("Create broker:", form);
    navigate("/broker");
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon">
            <BrokerIcon />
          </div>
          <div>
            <div className="page-title">Add Broker</div>
            <div className="page-subtitle">
              Fill in all details to register a new broker
            </div>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate("/broker")}>
          ← Back
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <BrokerForm
            form={form}
            set={set}
            setFile={setFile}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/broker")}
            submitLabel="Create Broker"
          />
        </div>
      </div>
    </div>
  );
}
