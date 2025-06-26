// src/app/guards/liga-selecionada.guard.ts
import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SelecionarLigaService } from '../services/selecionar-liga.service';

export const ligaSelecionadaGuard: CanActivateFn = () => {
  const sel = inject(SelecionarLigaService);
  const router = inject(Router);
  return sel.liga$()            // se houver liga, segue
    ? true
    : router.parseUrl('/ligas');  // senão volta para /ligas
};