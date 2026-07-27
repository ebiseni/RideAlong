import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDocuments } from "../../hooks/useDocuments";
import EmptyState from "../../components/shared/EmptyState";
import "../../styles/pages/documents/DocumentsListPage.css";

import documentIcon from "../../assets/icons/document-icon.svg";
import searchIcon from "../../assets/icons/reminder-search-icon.svg";
import plusIcon from "../../assets/icons/reminder-plus-icon.svg";
import emptyDocumentsIllustration from "../../assets/images/reminder-emptysate-illustration.png"; // TEMP: reusing reminders empty-state illustration until a documents-specific one is provided

export default function DocumentsListPage() {
  const navigate = useNavigate();
  const { documents } = useDocuments();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="documents-container">
      <div className="documents-header-flex">
        <h1 className="documents-title">My Documents</h1>
        <button
          className="add-document-btn"
          onClick={() => navigate("/documents/add")}
        >
          <img src={plusIcon} alt="" className="add-document-icon" />
          Add Document
        </button>
      </div>

      {documents.length > 0 && (
        <div className="documents-search">
          <img src={searchIcon} alt="" className="documents-search-icon" />
          <input
            type="text"
            placeholder="Search by vehicle, name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {documents.length === 0 ? (
        <div className="documents-empty-wrapper">
          <EmptyState
            icon={
              <img
                src={emptyDocumentsIllustration}
                alt=""
                className="documents-empty-illustration"
              />
            }
            title="No documents yet"
            description="Add your vehicle documents to keep track of their status and expiry dates."
          />
        </div>
      ) : (
        <div className="documents-grid">
          {filteredDocuments.map((doc) => (
            <button
              key={doc.id}
              className="document-card"
              onClick={() => navigate(`/documents/${doc.id}`)}
            >
              <img src={documentIcon} alt="" className="document-card-icon" />
              <div className="document-card-text">
                <p className="document-card-name">{doc.name}</p>
                <p className="document-card-mask">••••••••••••</p>
              </div>
              <span className="document-card-arrow">›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}