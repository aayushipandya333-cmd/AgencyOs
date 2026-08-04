from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.auth import (
    AuthUser,
    require_view,
    require_create,
    require_edit,
    require_delete,
)

from app.models.lead import Lead
from app.schemas.lead import LeadCreate, LeadUpdate, LeadResponse


router = APIRouter(
    prefix="/api/leads",
    tags=["Leads"]
)


@router.get("", response_model=List[LeadResponse])
def list_leads(
    user: AuthUser = Depends(require_view),
    db: Session = Depends(get_db)
):
    leads = db.query(Lead).filter(
        Lead.org_id == user.org_id
    ).all()

    return leads


@router.post("", response_model=LeadResponse)
def create_lead(
    lead_data: LeadCreate,
    user: AuthUser = Depends(require_create),
    db: Session = Depends(get_db)
):
    lead = Lead(
        company_name=lead_data.company_name,
        website=lead_data.website,
        email=lead_data.email,
        industry=lead_data.industry,
        status=lead_data.status,
        notes=lead_data.notes,
        org_id=user.org_id,
        created_by=user.user_id,
    )

    db.add(lead)
    db.commit()
    db.refresh(lead)

    return lead


@router.get("/{lead_id}", response_model=LeadResponse)
def get_lead(
    lead_id: str,
    user: AuthUser = Depends(require_view),
    db: Session = Depends(get_db)
):
    lead = db.query(Lead).filter(
        Lead.id == lead_id,
        Lead.org_id == user.org_id
    ).first()

    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )

    return lead


@router.put("/{lead_id}", response_model=LeadResponse)
def update_lead(
    lead_id: str,
    lead_data: LeadUpdate,
    user: AuthUser = Depends(require_edit),
    db: Session = Depends(get_db)
):
    lead = db.query(Lead).filter(
        Lead.id == lead_id,
        Lead.org_id == user.org_id
    ).first()

    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )

    if lead_data.company_name is not None:
        lead.company_name = lead_data.company_name

    if lead_data.website is not None:
        lead.website = lead_data.website

    if lead_data.email is not None:
        lead.email = lead_data.email

    if lead_data.industry is not None:
        lead.industry = lead_data.industry

    if lead_data.status is not None:
        lead.status = lead_data.status

    if lead_data.notes is not None:
        lead.notes = lead_data.notes

    db.commit()
    db.refresh(lead)

    return lead


@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lead(
    lead_id: str,
    user: AuthUser = Depends(require_delete),
    db: Session = Depends(get_db)
):
    lead = db.query(Lead).filter(
        Lead.id == lead_id,
        Lead.org_id == user.org_id
    ).first()

    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )

    db.delete(lead)
    db.commit()

    return None