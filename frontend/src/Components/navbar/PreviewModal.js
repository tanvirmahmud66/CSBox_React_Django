import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import AuthContext from '../../context/AuthContext';
import BaseUrl from '../BaseUrl';

const PreviewModal = ({ isOpen, onRequestClose,}) => {


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Example Modal"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="card my-card">
        <div class="alert alert-warning" role="alert">
            This access is designed for a brief application preview. To proceed further, please create your account using the necessary credentials.
        </div>
        <div className='card-body pt-0 d-flex justify-content-between align-items-center'>
            <div>
              <div className='text-primary'>Username: <span className='text-danger'>fahim</span></div>
              <div className='text-primary'>Password: <span className='text-danger'>12345678</span></div>
            </div>
            <button onClick={onRequestClose} className='btn btn-custom-green shadow'>OK</button>
        </div>
      </div>
    </Modal>
  );
};

export default PreviewModal;
